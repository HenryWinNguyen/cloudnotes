// apps/web/app/api/run-note/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { spawn } from "child_process";

type Language = "python" | "cpp";

const PYTHON_IMAGE = "python:3.11-alpine";
const CPP_IMAGE = "gcc:13.2"; // or "gcc:latest"
const TIMEOUT_MS = 30000; // 30 seconds

function runInDocker(language: Language, code: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const commonArgs = [
      "run",
      "--rm",
      "-i",                // attach stdin
      "--network=none",    // no network access
      "--memory=256m",     // memory limit
      "--cpus=0.5",        // CPU limit (half core)
      "--pids-limit=64",   // limit number of processes
    ];

    let args: string[];

    if (language === "python") {
      args = [...commonArgs, PYTHON_IMAGE, "python", "-"];
    } else {
      // C++: read stdin to main.cpp, compile, then run
      const compileAndRun =
        'cat > main.cpp && g++ main.cpp -O2 -std=c++17 -o main && ./main';
      args = [...commonArgs, CPP_IMAGE, "bash", "-lc", compileAndRun];
    }

    const child = spawn("docker", args);

    let stdout = "";
    let stderr = "";
    let finished = false;

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (err) => {
      if (finished) return;
      finished = true;
      reject(err);
    });

    child.on("close", (exitCode) => {
      if (finished) return;
      finished = true;

      if (exitCode === 0) {
        resolve({ stdout, stderr });
      } else {
        const err: any = new Error(`Docker exited with code ${exitCode}`);
        err.stdout = stdout;
        err.stderr = stderr;
        reject(err);
      }
    });

    // Timeout: kill container if it runs too long
    const timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      child.kill("SIGKILL");
      const err: any = new Error(`Execution timed out after ${TIMEOUT_MS} ms`);
      err.stdout = stdout;
      err.stderr = stderr;
      reject(err);
    }, TIMEOUT_MS);

    child.on("close", () => clearTimeout(timer));
    child.on("error", () => clearTimeout(timer));

    // Send code to container stdin
    child.stdin.write(code);
    child.stdin.end();
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { noteId?: string; language?: Language }
      | null;

    const noteId = body?.noteId;
    const language: Language = body?.language === "cpp" ? "cpp" : "python";

    if (!noteId) {
      return NextResponse.json(
        { ok: false, log: "Missing noteId in request body." },
        { status: 400 }
      );
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { cells: true },
    });

    if (!note) {
      return NextResponse.json(
        { ok: false, log: "Note not found." },
        { status: 404 }
      );
    }

    const lastCodeCell = [...note.cells]
      .filter((c) => c.type === "code")
      .sort((a, b) => b.order - a.order)[0];

    if (!lastCodeCell || !lastCodeCell.content.trim()) {
      return NextResponse.json(
        { ok: false, log: "No code cells with content to run." },
        { status: 400 }
      );
    }

    const code = lastCodeCell.content;

    try {
      const { stdout, stderr } = await runInDocker(language, code);

      const log = (stdout + (stderr ? "\n[stderr]\n" + stderr : "")).trim() || "(no output)";
      return NextResponse.json({ ok: true, log });
    } catch (err: any) {
      const stdout = err?.stdout ?? "";
      const stderr = err?.stderr ?? "";
      const combined = (stdout + (stderr ? "\n[stderr]\n" + stderr : "")).trim();

      const log =
        combined ||
        `Run failed. Docker error: ${String(err?.message ?? err)}`;

      return NextResponse.json({ ok: false, log });
    }
  } catch {
    return NextResponse.json(
      { ok: false, log: "Unexpected server error in /api/run-note." },
      { status: 500 }
    );
  }
}

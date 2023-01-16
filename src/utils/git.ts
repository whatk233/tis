export async function getShortCommit() {
  const gitCommand = ["git", "rev-parse", "--short", "HEAD"];
  try {
    const process = Deno.run({ cmd: gitCommand, stdout: "piped" });
    const stdout = await process.output();
    return new TextDecoder().decode(stdout).trim();
  } catch {
    return "";
  }
}

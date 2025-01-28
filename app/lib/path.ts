import fs from "node:fs";

/**
 * Checks if a provided binary file exists in PATH.
 *
 * @param {string} binary The name of the binary to find
 * @returns {Promise<boolean>} Result of the path search
 */
export async function checkPathForBinary(
  binary: string
): Promise<{ name: string; dir?: string | null; exists: boolean }> {
  // Get the list of paths into an array
  const directories = process.env.PATH?.split(":");

  for (const dir of directories!) {
    // Check if the directory actually exists.
    // If not, skip this directory.
    try {
      fs.opendirSync(dir);
    } catch (err) {
      continue;
    }

    // Open the directory and go through all files.
    for await (let f of await fs.promises.opendir(dir)) {
      // If `f` is not a file, skip it.
      if (!f.isFile()) {
        continue;
      }

      // Assuming it's a file, check if its name equals to the provided name.
      // If so, return true.
      if (f.name === binary) {
        return { name: binary, dir, exists: true };
      }
    }
  }

  return { name: binary, dir: null, exists: false };
}

import versionFile from "../../version.json" assert { type: "json" };

export default function getVersion() {
  if (versionFile.version) {
    return versionFile.version;
  } else {
    throw new Error("Can't get version!");
  }
}

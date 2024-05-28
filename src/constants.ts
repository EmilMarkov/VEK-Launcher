import path from "path";
import { Settings } from "./Settings";
import os from "os";

let appDataDirectory: string;

if (os.platform() === "win32") {
    appDataDirectory = process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");
} else if (os.platform() === "darwin") {
    appDataDirectory = path.join(os.homedir(), "Library", "Application Support");
} else {
    appDataDirectory = path.join(os.homedir(), ".config");
}

const databasePath = path.join(
    appDataDirectory,
    Settings.appName,
    Settings.appName.toLowerCase().replace(/\s+/g, '') + ".sqlite"
);

export { databasePath };

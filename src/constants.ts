import path from "path";
import { appDataDir } from '@tauri-apps/api/path';
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

// const databasePath = path.join(
//     appDataDirectory,
//     Settings.appName,
//     Settings.appName.toLowerCase().replace(/\s+/g, '') + ".db"
// );

const databasePath = "./veklauncher.db";

export { databasePath };

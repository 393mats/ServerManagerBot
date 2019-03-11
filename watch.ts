// Watcher for getting Minecraft log
// tslint:disable:no-console
// Import
import chokidar = require("chokidar");
import { EventEmitter } from "events";
import fs = require("fs");
import rl = require("readline");

// Watcher class
export default class Watcher extends EventEmitter {

    public fileName: string;
    public watcher: any;
    public count: number;

    constructor(fileName: string) {
        super();
        this.fileName = fileName;
        this.watcher = null;
        this.watch();
    }

    public watch() {
        // Already watching
        if (!this.watcher === null) {
            console.log("既に実行しています。");
            return;
        }

        // Count characters
        this.count = this.getPosition(this.fileName);

        // Initialize watcher
        this.watcher = chokidar.watch(this.fileName, {
            ignored: /[\/\\]\./,
            persistent: true,
        });

        console.log(this.count);

        // Watch
        this.watcher.on("ready", () => { console.log("Start", this.count); })
        .on("change", (path: string) => {

            // Open the log file
            const stream = fs.createReadStream(this.fileName, {
                encoding: "utf8",
                start: this.count,
            });
            // Create interface
            const reader = rl.createInterface({ input: stream });
            reader.on("line", (data: string) => {
                // Reload size
                this.count = this.getPosition(this.fileName);
                if (data === "") { return; }
                // Output
                this.emit("log", data);
            });
        })
        .on("error", (error: any) => {
            this.close();
            console.log("ERROR: " + error + "\nThis task is closed.");
        });
    }

    // Close watcher
    public close() {
        this.watcher.close();
        this.watcher = null;
    }

    // Sync file data
    private sync(filename: string) {
        try {
            return fs.statSync(filename);
          } catch (err) {
            return false;
          }
    }

    // Get character position
    private getPosition(filename): number {
        // Get position
        const pos: any = this.sync(filename);
        const position: number = pos.size;
        return position;
    }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Watcher for Server Manager by Tetsuya Matsuda
// Watcher for getting Minecraft log
// tslint:disable:no-console
// Import
const chokidar = require("chokidar");
const events_1 = require("events");
const fs = require("fs");
const rl = require("readline");
// Watcher class
class Watcher extends events_1.EventEmitter {
    constructor(fileName) {
        super();
        this.fileName = fileName;
        this.watcher = null;
        this.watch();
    }
    watch() {
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
            .on("change", (path) => {
            // Open the log file
            const stream = fs.createReadStream(this.fileName, {
                encoding: "utf8",
                start: this.count,
            });
            // Create interface
            const reader = rl.createInterface({ input: stream });
            reader.on("line", (data) => {
                // Reload size
                this.count = this.getPosition(this.fileName);
                if (data === "") {
                    return;
                }
                // Output
                this.emit("log", data);
            });
        })
            .on("error", (error) => {
            this.close();
            console.log("ERROR: " + error + "\nThis task is closed.");
        });
    }
    // Close watcher
    close() {
        this.watcher.close();
        this.watcher = null;
    }
    // Sync file data
    sync(filename) {
        try {
            return fs.statSync(filename);
        }
        catch (err) {
            return false;
        }
    }
    // Get character position
    getPosition(filename) {
        // Get position
        const pos = this.sync(filename);
        const position = pos.size;
        return position;
    }
}
exports.default = Watcher;
//# sourceMappingURL=watch.js.map
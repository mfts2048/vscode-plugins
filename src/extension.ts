import { existsSync } from "fs";
import { join } from "path";
import {
	ExtensionContext,
	TerminalOptions,
	StatusBarAlignment,
	workspace,
	window,
	commands,
} from "vscode";

let openFolder: string = "dist";

export function activate({ subscriptions }: ExtensionContext) {
	let myStatusBarItem = window.createStatusBarItem(
		StatusBarAlignment.Right,
		100,
	);

	const myCommandId = "sample.showSelectionCount";

	const fn = commands.registerCommand(myCommandId, () => {
		const { workspaceFolders } = workspace;
		if (!workspaceFolders) {
			console.log("Please open the folder and try again.");
			return;
		}

		const rootFolderPath = workspaceFolders[0].uri.fsPath;
		const distPath = join(rootFolderPath, openFolder);
		// 判断dist文件夹是否存在
		if (existsSync(distPath)) {
			const options: TerminalOptions = {
				shellPath:
					"C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
				name: "powershell",
			};
			const terminal = window.createTerminal(options);
			terminal.sendText(`explorer ${distPath}`);
			terminal.show();
		}
	});

	function core() {
		const workbenchConfig = workspace.getConfiguration("mfts");
		const enabled: boolean = workbenchConfig.get("enabled") ?? true;
		openFolder = workbenchConfig.get("distPath") ?? "dist";

		if (!enabled) {
			const index = subscriptions.findIndex((el) => el === fn);
			if (index !== -1) {
				subscriptions.splice(index, 1);
			}
			myStatusBarItem.hide();
			return;
		}

		subscriptions.push(fn);

		myStatusBarItem.show();
		myStatusBarItem.command = myCommandId;
		myStatusBarItem.text = "open dist";
		myStatusBarItem.color = "white";
		myStatusBarItem.tooltip = "Parinfer is in mode";
	}

	workspace.onDidChangeConfiguration((e) => {
		core();
	});

	core();
}

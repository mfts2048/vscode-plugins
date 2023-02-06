import { existsSync } from "fs";
import { join } from "path";
import {
	workspace,
	window,
	ExtensionContext,
	TerminalOptions,
	StatusBarItem,
	StatusBarAlignment,
	commands,
} from "vscode";

let myStatusBarItem: StatusBarItem;
let openFolder: string = "dist";

export function activate({ subscriptions }: ExtensionContext) {
	const { workspaceFolders } = workspace;
	if (!workspaceFolders) {
		console.log("Please open the folder and try again.");
		return;
	}

	const myCommandId = "sample.showSelectionCount";
	subscriptions.push(
		commands.registerCommand(myCommandId, () => {
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
		}),
	);

	myStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
	myStatusBarItem.show();
	myStatusBarItem.command = myCommandId;
	myStatusBarItem.text = "open dist";
	myStatusBarItem.color = "white";
	myStatusBarItem.tooltip = "Parinfer is in mode";
}

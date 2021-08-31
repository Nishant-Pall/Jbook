import MonacoEditor from "@monaco-editor/react";

const CodeEdtior = () => {
    return (
        <MonacoEditor
            options={{
                wordWrap: "on",
                minimap: { enabled: false },
                showUnused: false,
                folding: false,
                lineNumbersMinChars: 3,
                fontSize: 16,
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}
            theme="dark"
            language="javascript"
            height="200px"
        />
    );
};
export default CodeEdtior;

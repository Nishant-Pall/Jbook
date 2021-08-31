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
                fontSize: 18,
                scrollBeyondLastLine: false,
            }}
            theme="dark"
            language="javascript"
            height="200px"
        />
    );
};
export default CodeEdtior;

import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { useRef } from "react";
import "./code-editor.css";
import "./syntax.css";

interface CodeEditorProps {
    initialValue: string;
    onChange(value: string): void;
}

const CodeEdtior: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
    const editorRef = useRef<any>();

    const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
        editorRef.current = monacoEditor;
        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue());
        });
        monacoEditor.getModel()?.updateOptions({ tabSize: 4 });

        const highlighter = new Highlighter(
            // to not typecheck the line
            // @ts-ignore
            window.moncao,
            codeShift,
            monacoEditor
        );

        // Weird code just to avoid logging of errors in console
        highlighter.highLightOnDidChangeModelContent(
            () => {},
            () => {},
            undefined,
            () => {}
        );
    };
    const onFormatClick = () => {
        // get current value from editor
        const unformatted = editorRef.current.getModel().getValue();

        // format that value
        const formatted = prettier
            .format(unformatted, {
                parser: "babel",
                plugins: [parser],
                semi: true,
                singleQuote: true,
            })
            .replace(/\n$/, "");

        // set the formatted value back
        editorRef.current.setValue(formatted);
    };
    return (
        <div className="editor-wrapper">
            <button
                className="button button-format is-primary is-small"
                onClick={onFormatClick}
            >
                Format
            </button>
            <MonacoEditor
                editorDidMount={onEditorDidMount}
                value={initialValue}
                theme="dark"
                language="javascript"
                height="100%"
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
            />
        </div>
    );
};
export default CodeEdtior;

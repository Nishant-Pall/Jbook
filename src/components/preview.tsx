import React, { useRef, useEffect } from "react";
import "./preview.css";

interface PreviewProps {
    code: string;
}

const html = `
        <html>
            <head>
            </head>
            <body>
                <div id="root"></div>
                <script>
                    window.addEventListener('message' ,(event)=>{
                        try{
                            eval(event.data);
                        } catch(err){
                            const root = document.querySelector('#root');
                            root.innerHTML = '<div style="color:red;"><h4>Runtime Error</h4>' + err + '</div>'
                            console.error(err);
                        }
                    }, false);
                </script>
            </body>
        </html>
`;
const Preview: React.FC<PreviewProps> = ({ code }) => {
    const iframe = useRef<any>();
    useEffect(() => {
        iframe.current.srcdoc = html;
        // sending our output to iframe
        iframe.current.contentWindow.postMessage(code, "*");
    }, [code]);
    return (
        <div className="iframe-wrapper">
            <iframe
                title="preview"
                ref={iframe}
                srcDoc={html}
                sandbox="allow-scripts"
            />
        </div>
    );
};

export default Preview;

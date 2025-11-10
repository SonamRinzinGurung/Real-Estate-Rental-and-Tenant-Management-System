import PropTypes from "prop-types";
import { useEffect, useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
};

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

function ImageDropZone({
    fileState,
    setFileState,
    label = "Upload Image",
    maxFiles = 1,
}) {
    const previewsRef = useRef(new Map());

    const {
        getRootProps,
        getInputProps,
        open,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: {
            "image/*": [],
        },
        noClick: true,
        noKeyboard: true,
        onDrop: (acceptedFiles) => {
            const existingCount = (fileState || []).length;
            const remaining = Math.max(0, maxFiles - existingCount);
            if (remaining === 0) {
                // nothing to add
                console.warn("Max files reached");
                return;
            }
            const toAdd = acceptedFiles.slice(0, remaining);
            const mapped = toAdd.map((file) => {
                const preview = URL.createObjectURL(file);
                const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                previewsRef.current.set(id, preview);
                return Object.assign(file, { preview, id });
            });
            setFileState((prev = []) =>
                maxFiles > 1 ? [...prev, ...mapped] : mapped
            );
            if (acceptedFiles.length > remaining) {
                console.warn(
                    `Only ${remaining} file(s) accepted to respect maxFiles=${maxFiles}`
                );
            }
        },
        maxFiles: maxFiles,
        multiple: maxFiles > 1,
    });

    const removeFile = (id) => {
        setFileState((prev = []) => {
            const toRemove = prev.find((f) => f.id === id);
            if (toRemove) {
                const preview = previewsRef.current.get(id) || toRemove.preview;
                if (preview) {
                    URL.revokeObjectURL(preview);
                }
                previewsRef.current.delete(id);
            }
            return prev.filter((f) => f.id !== id);
        });
    };
    const thumbs = fileState?.map((file) => (
        <div key={file.id} className="min-w-fit h-24 rounded-sm relative group">
            <img
                alt={file.name}
                src={file.preview}
                className="w-auto h-full rounded-sm"
            />
            <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden
            >
                <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold"
                >
                    X
                </button>
            </div>
        </div>
    ));

    useEffect(() => {
        // cleanup on unmount: revoke any previews we created and clear the map
        return () => {
            previewsRef.current.forEach((preview) => {
                try {
                    URL.revokeObjectURL(preview);
                } catch (e) { }
            });
            previewsRef.current.clear();
        };
    }, []);

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    return (
        <div className="container flex flex-col gap-2">
            <h5>
                {label} {maxFiles > 1 ? `(${maxFiles} Allowed)` : ""}
            </h5>
            <div {...getRootProps({ className: "dropzone", style })}>
                <input {...getInputProps()} />

                <div className="flex gap-2 items-center justify-center flex-wrap">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    <p>Drag and drop image{maxFiles > 1 ? "s" : ""} here or</p>
                    <button
                        type="button"
                        onClick={open}
                        className="px-2 py-[2px] bg-gray-400 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Browse
                    </button>
                </div>
            </div>
            {fileState?.length > 0 && (
                <aside className="flex flex-wrap gap-1 shadow-lg px-4 py-2 rounded-md">
                    {thumbs}
                </aside>
            )}
        </div>
    );
}

export default ImageDropZone;

ImageDropZone.propTypes = {
    fileState: PropTypes.arrayOf(PropTypes.object).isRequired,
    setFileState: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    maxFiles: PropTypes.number,
};
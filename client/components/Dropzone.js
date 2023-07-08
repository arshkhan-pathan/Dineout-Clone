// packages
import { useEffect, useState } from "react";
import ReactDropzone from "react-dropzone";
import { styled, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

const StyledDropzone = styled("div")({
  padding: "20px",
  border: "2px dashed #aaa",
  borderRadius: "5px",
  textAlign: "center",
  cursor: "pointer",
  "&:hover": {
    borderColor: "#777",
  },
});

const FileRow = styled("div")({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
  paddingInline: "15px",
});

const FileName = styled("span")({
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const Dropzone = ({ allFiles, handleDrop, handleDelete, title }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles(allFiles);
  }, [allFiles]);

  return (
    <ReactDropzone onDrop={handleDrop} multiple>
      {({ getRootProps, getInputProps }) => (
        <section>
          <StyledDropzone {...getRootProps()}>
            <input {...getInputProps()} />
            <p>
              Drag &apos;n&apos; drop {title} images here, or click to select
              files
            </p>
          </StyledDropzone>
          {files &&
            files?.map((file, index) => (
              <FileRow key={index}>
                <FileName>{file?.file?.name}</FileName>
                <IconButton
                  color="secondary"
                  onClick={() => handleDelete(index)}
                >
                  <Delete />
                </IconButton>
              </FileRow>
            ))}
        </section>
      )}
    </ReactDropzone>
  );
};

export default Dropzone;

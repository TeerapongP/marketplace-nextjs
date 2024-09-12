export default interface FileInputCircleProps {
  onFileChange: (files: { [key: string]: File }) => void;
}

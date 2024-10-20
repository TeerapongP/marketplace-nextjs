export default interface FileInputProps {
  onFileChange: (files: File[]) => void; // Ensure the correct function signature
  value?: string | File[]; // Accept both string URLs and File arrays
  className?: string; // For custom styles
}

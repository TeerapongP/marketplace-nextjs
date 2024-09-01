export default interface ToggleSwitchProps {
    label: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}
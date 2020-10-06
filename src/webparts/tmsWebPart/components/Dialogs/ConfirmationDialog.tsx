/**
 * React Package Import
 */
import * as React from "react";

/**
 * Confirmation Dialog Props Creation.
 */
interface IConfirmationDialogProps {
  title: string;
  show: boolean;
  type: "Submit" | "Update" | "Save";
  onHide: () => void;
  onConfirm: () => any;
}

/**
 * Main Method For Confirmation Dialog.
 */
const ConfirmationDialog: React.SFC<IConfirmationDialogProps> = (props) => {
  return <div></div>;
};


/**
 * Export Confirmation Method
 */
export default ConfirmationDialog;
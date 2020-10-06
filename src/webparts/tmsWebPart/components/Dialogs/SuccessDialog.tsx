/**
 * React Package Import
 */
import * as React from "react";

/**
 * Sucess Dialog Props Creation.
 */
interface ISuccessDialogProps {
  title: string;
  show: boolean;
  onHide: () => void;
}

/**
 * Main Method For Success Dialog.
 */
const SuccessDialog: React.SFC<ISuccessDialogProps> = (props) => {
  return <div></div>;
};

/**
 * Export SuccessDialog Method
 */
export default SuccessDialog;

import Modal from './Modal';

function ConfirmDialog({
  open,
  title = 'Confirm',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isSubmitting = false,
  submitError = '',
}) {
  const busyLabel =
    isSubmitting && confirmLabel === 'Delete' ? 'Deleting...' : confirmLabel;

  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      closeDisabled={isSubmitting}
    >
      <div className="confirm-dialog">
        <p className="confirm-dialog__message">{message}</p>
        {submitError ? (
          <p className="field__error" role="alert">
            {submitError}
          </p>
        ) : null}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={isSubmitting}
            aria-busy={isSubmitting ? 'true' : undefined}
          >
            {isSubmitting ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;

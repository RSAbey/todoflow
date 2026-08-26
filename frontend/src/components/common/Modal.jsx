import { useEffect, useId, useRef } from 'react';

function Modal({ open, title, onClose, children, closeDisabled = false }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open) {
      previousFocusRef.current = document.activeElement;
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleDialogClose() {
    const previous = previousFocusRef.current;
    if (previous && typeof previous.focus === 'function') {
      previous.focus();
    }
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onClose={handleDialogClose}
    >
      <div className="modal__header">
        <h2 id={titleId} className="modal__title">
          {title}
        </h2>
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          aria-label="Close dialog"
          disabled={closeDisabled}
          onClick={() => dialogRef.current?.close()}
        >
          ×
        </button>
      </div>
      <div className="modal__body">{children}</div>
    </dialog>
  );
}

export default Modal;

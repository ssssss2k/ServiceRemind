import { useEffect, useRef, useState } from 'react';

const FORM_ENDPOINT = 'https://formspree.io/f/mnpazjve';

export default function ContactModal({
  open,
  onClose,
  t,
  onToast,
}) {
  const dialogRef = useRef(null);

  const [submitting, setSubmitting] =
    useState(false);


  useEffect(() => {
    const dialog =
      dialogRef.current;

    if (!dialog) return;


    if (
      open
      && !dialog.open
    ) {
      dialog.showModal();

      document.body.style.overflow =
        'hidden';
    }


    if (
      !open
      && dialog.open
    ) {
      dialog.close();

      document.body.style.overflow =
        '';
    }

  }, [open]);


  useEffect(() => {
    return () => {
      document.body.style.overflow =
        '';
    };
  }, []);


  const closeModal = () => {
    onClose();

    document.body.style.overflow =
      '';
  };


  const handleBackdropClick = (
    event
  ) => {
    const dialog =
      dialogRef.current;

    if (!dialog) return;


    const rect =
      dialog.getBoundingClientRect();


    const clickedInside =
      event.clientX >= rect.left
      && event.clientX <= rect.right
      && event.clientY >= rect.top
      && event.clientY <= rect.bottom;


    if (!clickedInside) {
      closeModal();
    }
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();


    const form =
      event.currentTarget;


    setSubmitting(true);


    try {
      const response =
        await fetch(
          FORM_ENDPOINT,
          {
            method: 'POST',

            body:
              new FormData(form),

            headers: {
              Accept:
                'application/json',
            },
          }
        );


      if (!response.ok) {
        throw new Error(
          'Formspree request failed'
        );
      }


      form.reset();

      closeModal();

      onToast(
        t.toastSuccess,
        false
      );

    } catch {
      onToast(
        t.toastError,
        true
      );

    } finally {
      setSubmitting(false);
    }
  };


  return (
    <dialog
      ref={dialogRef}
      className="contact-modal contact-modal-wide"
      onClick={handleBackdropClick}
      onCancel={(event) => {
        event.preventDefault();

        closeModal();
      }}
    >

      <div className="modal-content">


        <button
          type="button"
          className="modal-close"
          aria-label={
            t.workClose
            || 'Close'
          }
          onClick={closeModal}
        >
          ×
        </button>


        <h2>
          {t.modalTitle}
        </h2>


        <p>
          {t.modalDesc}
        </p>


        <form
          action={FORM_ENDPOINT}
          method="POST"
          className="modal-form modal-form-grid"
          onSubmit={handleSubmit}
        >


          <label className="modal-field">

            <span>
              {t.modalName}

              <b className="required-mark">
                *
              </b>
            </span>

            <input
              type="text"
              name="Name"
              autoComplete="name"
              required
            />

          </label>



          <label className="modal-field">

            <span>
              {t.modalEmail}

              <b className="required-mark">
                *
              </b>
            </span>

            <input
              type="email"
              name="Email"
              autoComplete="email"
              required
            />

          </label>



          <label className="modal-field modal-field-full">

            <span>
              {t.modalPhone}
            </span>

            <input
              type="tel"
              name="Phone"
              autoComplete="tel"
            />

          </label>



          <label className="modal-field modal-field-full">

            <span>
              {t.modalMessage}

              <b className="required-mark">
                *
              </b>
            </span>

            <textarea
              name="Message"
              rows="6"
              required
            />

          </label>



          <div className="modal-field-full contact-modal-actions">

            <button
              type="button"
              className="work-secondary-btn contact-modal-cancel-btn"
              onClick={closeModal}
            >
              {t.workCancel || 'Cancel'}
            </button>


            <button
              type="submit"
              className="btn btn-black"
              disabled={submitting}
            >
              {submitting
                ? '...'
                : t.modalSubmit}
            </button>

          </div>


        </form>


      </div>

    </dialog>
  );
}
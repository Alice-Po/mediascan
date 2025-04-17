import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

const ContactForm = () => {
  const [state, handleSubmit] = useForm('mjkbnlaz');

  if (state.succeeded) {
    return (
      <div className="text-center py-8">
        <div className="text-green-600 text-xl mb-2">✨ Merci pour votre retour !</div>
        <p className="text-gray-600">
          Nous l'examinerons avec attention pour améliorer votre expérience.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Votre adresse mail
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="exemple@email.com"
        />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Votre message
        </label>
        <textarea
          id="message"
          name="message"
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Décrivez votre retour d'expérience, bug rencontré ou suggestion d'amélioration..."
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="text-red-500 text-sm mt-1"
        />
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
      >
        {state.submitting ? 'Envoi en cours...' : 'Envoyer mon retour'}
      </button>
    </form>
  );
};

export default ContactForm;

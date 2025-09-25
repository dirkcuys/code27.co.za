class ContactForm extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback () {
    this.innerHTML = `
      <style>
        #contactForm, #contactForm .form-group {
          display: grid;
          line-height: 2em;
        }
        #contactForm { gap: 0.6em; } 
      </style>
      <form id="contactForm">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>

        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" placeholder="Tell us about your project..." rows="4" required></textarea>
        </div>
        <button type="submit" class="submit-btn">Send us an Email</button>
      </form>
    `
    document.getElementById('contactForm').addEventListener('submit', this.postData.bind(this));

  }

  showFormMessage(message) {
    let formMessage = document.getElementById('waiting-list-success')
    formMessage.innerText = message;
    formMessage.classList.remove('hidden');
    document.getElementById('waitingListForm').classList.add('hidden');
  }


  async postData(e) {
    console.log('postData');
    e.preventDefault();

    const name = this.querySelector('#name').value;
    const email = this.querySelector('#email').value;
    const message = this.querySelector('#message').value;
    const source = this.getAttribute('source') || 'website_contact_form';
    const uuid = this.getAttribute('uuid');

    if (name && email && message) {
      const formData = {
        name,
        email,
        content: message,
        source,
        uuid,
      };

      console.log('Form submitted:', formData);

      const submitBtn = document.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;

      const url = 'https://api.launch-pages.com/contact/';
      try {
        // Provide user feedback
        submitBtn.textContent = 'Sending message';
        submitBtn.style.background = '#6b635a';
        submitBtn.disabled = true;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          e.target.reset();
          submitBtn.textContent = 'Message sent';

        } else {
          const errorData = await response.json();
          console.error('Form submission error:', errorData);
          console.log('There was an error sending your message. Please try again.');

          submitBtn.textContent = 'Something went wrong';
        }
      } catch (error) {
        console.error('Network error:', error);
        submitBtn.textContent = 'Something went wrong';
      } finally {
        // Reset button state
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '#2d2923';
          submitBtn.disabled = false;
          document.getElementById('contactForm').reset();
        }, 3000);
      }               
    }
  }
}

customElements.define('contact-form', ContactForm);

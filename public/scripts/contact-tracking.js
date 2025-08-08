/**
 * Contact Form Tracking Client-Side Script
 * Handles contact form interactions, validation, and FAQ tracking
 */

// Contact form submission tracking - exposed globally
window.trackContactForm = function(formType = 'contact', formData = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_submit', {
      form_name: formType,
      content_group: 'contact',
      engagement_time_msec: Date.now() - performance.timeOrigin,
      ...formData
    });
  } else if (window.location.hostname === 'localhost') {
    console.log('Contact form tracked (gtag not available):', formType, formData);
  }
};

// Form field interaction tracking
window.trackFormFieldInteraction = function(fieldName, action, value) {
  const eventData = {
    field_name: fieldName,
    action: action,
    form_type: 'contact'
  };
  
  if (value && action === 'input') {
    eventData.field_value_length = value.length;
  }
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_field_interaction', eventData);
  }
};

// Form validation error tracking
window.trackFormValidationError = function(fieldName, errorType) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_validation_error', {
      field_name: fieldName,
      error_type: errorType,
      form_type: 'contact'
    });
  }
};

// FAQ interaction tracking
window.trackFAQInteraction = function(question, action = 'click') {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'faq_interaction', {
      faq_question: question,
      action: action,
      content_type: 'faq',
      engagement_time_msec: Date.now() - performance.timeOrigin
    });
  }
};

// Form progress tracking
window.trackFormProgress = function(fieldsCompleted, totalFields) {
  const progressPercent = Math.round((fieldsCompleted / totalFields) * 100);
  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_progress', {
      form_type: 'contact',
      fields_completed: fieldsCompleted,
      total_fields: totalFields,
      progress_percent: progressPercent
    });
  }
};

// Form abandonment tracking
window.trackFormAbandonment = function(fieldsCompleted, timeSpent) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'form_abandonment', {
      form_type: 'contact',
      fields_completed: fieldsCompleted,
      time_spent_seconds: Math.round(timeSpent / 1000),
      abandonment_point: fieldsCompleted > 0 ? 'partial' : 'immediate'
    });
  }
};

// Initialize contact form tracking on page load
document.addEventListener('DOMContentLoaded', function() {
  // Track contact form interactions with enhanced analytics
  const contactForms = document.querySelectorAll('#contact-form, form[name="contact"]');
  
  contactForms.forEach(form => {
    if (form) {
      const formFields = form.querySelectorAll('input, textarea, select');
      const totalFields = formFields.length;
      let startTime = Date.now();
      let fieldsInteractedWith = new Set();
      
      // Track form submission
      form.addEventListener('submit', function() {
        const fieldsCompleted = Array.from(formFields).filter(field => 
          field.value && field.value.trim() !== ''
        ).length;
        
        const formData = {
          fields_completed: fieldsCompleted,
          total_fields: totalFields,
          completion_rate: Math.round((fieldsCompleted / totalFields) * 100),
          time_to_submit: Math.round((Date.now() - startTime) / 1000)
        };
        
        // Use enhanced tracking if available
        if (typeof window.trackContactForm === 'function') {
          window.trackContactForm('contact_page', formData);
        }
      });
      
      // Track field interactions
      formFields.forEach(field => {
        // Track field focus
        field.addEventListener('focus', function() {
          fieldsInteractedWith.add(field.name || field.id);
          
          if (typeof window.trackFormFieldInteraction === 'function') {
            window.trackFormFieldInteraction(field.name || field.id, 'focus');
          }
        });
        
        // Track field input
        let inputTimeout;
        field.addEventListener('input', function() {
          clearTimeout(inputTimeout);
          inputTimeout = setTimeout(() => {
            if (typeof window.trackFormFieldInteraction === 'function') {
              window.trackFormFieldInteraction(field.name || field.id, 'input', field.value);
            }
          }, 1000); // Debounce input tracking
        });
        
        // Track field blur and progress
        field.addEventListener('blur', function() {
          if (typeof window.trackFormFieldInteraction === 'function') {
            window.trackFormFieldInteraction(field.name || field.id, 'blur', field.value);
          }
          
          // Track form progress
          const completedFields = Array.from(formFields).filter(f => 
            f.value && f.value.trim() !== ''
          ).length;
          
          if (typeof window.trackFormProgress === 'function') {
            window.trackFormProgress(completedFields, totalFields);
          }
        });
      });
      
      // Track form abandonment on page unload
      const trackAbandonment = () => {
        const completedFields = Array.from(formFields).filter(field => 
          field.value && field.value.trim() !== ''
        ).length;
        
        // Only track abandonment if user interacted with form but didn't submit
        if (fieldsInteractedWith.size > 0 && completedFields < totalFields) {
          const timeSpent = Date.now() - startTime;
          if (typeof window.trackFormAbandonment === 'function') {
            window.trackFormAbandonment(completedFields, timeSpent);
          }
        }
      };
      
      window.addEventListener('beforeunload', trackAbandonment);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          trackAbandonment();
        }
      });
    }
  });
  
  // Track FAQ interactions with optimized event handling  
  const faqItems = document.querySelectorAll('h3');
  faqItems.forEach(item => {
    if (item.textContent && item.textContent.includes('?')) {
      item.addEventListener('click', function() {
        // Use requestIdleCallback for non-blocking analytics
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            if (typeof window.trackFAQInteraction === 'function') {
              window.trackFAQInteraction(this.textContent.trim());
            }
          });
        } else {
          setTimeout(() => {
            if (typeof window.trackFAQInteraction === 'function') {
              window.trackFAQInteraction(this.textContent.trim());
            }
          }, 0);
        }
      }, { passive: true });
    }
  });
  
  // Track form validation errors
  const trackValidationErrors = () => {
    const forms = document.querySelectorAll('form[name="contact"]');
    
    forms.forEach(form => {
      form.addEventListener('invalid', function(e) {
        const field = e.target;
        let errorType = 'unknown';
        
        if (field.validity.valueMissing) {
          errorType = 'required_field_empty';
        } else if (field.validity.typeMismatch) {
          errorType = 'invalid_format';
        } else if (field.validity.tooShort) {
          errorType = 'too_short';
        } else if (field.validity.tooLong) {
          errorType = 'too_long';
        }
        
        if (typeof window.trackFormValidationError === 'function') {
          window.trackFormValidationError(field.name || field.id, errorType);
        }
      }, true); // Use capture phase to catch invalid events
    });
  };
  
  trackValidationErrors();
});
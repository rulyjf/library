(function ($) {
    $.fn.phoneInput = function () {
      return this.each(function () {
        const $input = $(this).find('.phone-number');
        const $flagContainer = $(this).find('.flag-container');
  
        // Function to update the flag
        function updateFlag() {
           fetch('data/country.json')
            .then(response => response.json())
            .then(data => {
                css = '';
                const keys = Object.keys(data);              
                keys.forEach(key => {
                  const country = data[key];
                    code = country.phoneCode.replace("+",""); 
                    if($input.val().startsWith(code)){
                      id = key.toLowerCase(); 
                      const countryCode = $input.val().substring(0, 2); // Assuming the first two characters are the country code
                      const flagUrl = `images/flag-icons-main/flags/4x3/${id}.svg`;
                      $flagContainer.html(`<img src="${flagUrl}" alt="${countryCode}" />`);
                    }    
                });
           });
        }
  
        // Attach event listener for input changes
        $input.on('input', function () {
          // Your phone number formatting/validation logic goes here
          // Example: Format the phone number as needed
          const formattedPhoneNumber = $input.val().replace(/\D/g, '');
          $input.val(formattedPhoneNumber);
  
          // Update the flag
          updateFlag();
        });
  
        // Initial flag update
        updateFlag();
      });
    };
  })(jQuery);
  
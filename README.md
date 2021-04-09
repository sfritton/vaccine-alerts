# vaccine-alerts

A simple project that sends email alerts to users when there are nearby vaccines available. For now at least, this only searches for vaccines in Minnesota.

## Usage
1. Clone this repo to your computer.
1. Create a `config.ts` file that matches `config.example.ts` and enter your users' information in the `RECIPIENTS` array.
1. Install [clasp](https://developers.google.com/apps-script/guides/clasp) on your computer and run `clasp login` to connect it to your Google account.
1. Run `clasp push` to add this project to your Apps Script account. If it worked, you should see a new `Vaccine-alerts` project at https://script.google.com/home.
1. Click on `Vaccine-alerts` to open that project. You'll notice that the code has been compiled to Google script (similar to Javascript), this is expected.
1. On the left-hand sidebar, click the clock icon labeled "Triggers". Click the floating "Add Trigger" button in the bottom right.
1. Make sure that the trigger is running the `main` function. Choose how often you want it to search for vaccines (you'll only be notified when it finds them) and click "Save". You're all set!

## Dependencies
- Vaccine data comes from the backend API of [Vaccine Spotter](https://github.com/GUI/covid-vaccine-finder)
- The project is compiled with [clasp](https://developers.google.com/apps-script/guides/clasp) and run on [Google Apps script](https://developers.google.com/apps-script)

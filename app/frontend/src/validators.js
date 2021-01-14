import { helpers } from 'vuelidate/lib/validators'

export const name = helpers.regex('name', /^[a-zA-Z\s-']*$/)
export const noDecimal = helpers.regex('noDecimal', /^\d{1,3}$/)
export const date = helpers.regex('date', /^[2][0][0-9][0-9][-][0-1][0-9][-][0-3][0-9]*$/)

const maxLengthField = [{ validator: 'maxLength', msg: 'This field is > the max allowed length.' }]
const requiredField = [{ validator: 'required', msg: 'This field is required.' }]
const urlField = [{ validator: 'url', msg: 'Not a valid URL. Are you missing https://?' }]
const emailField = [{ validator: 'email', msg: 'Not a valid email address.' }]
const nameField = [{ validator: 'name', msg: 'Name can only contain alphabetical characters.' }]

const betweenField = [{ validator: 'between', msg: 'Value outside of allowed range.' }]
const dateField = [{ validator: 'date', msg: 'Invalid date format, expected YYYY-MM-DD.' }]
const integerOnlyField = [{ validator: 'noDecimal', msg: 'Value must be a an integer.' }]
const numericField = [{ validator: 'numeric', msg: 'Value must be a number.' }]

const requiredMaxLengthField = [...maxLengthField, ...requiredField]
const optionalURLLengthField = [...maxLengthField, ...urlField]
const requiredEmailField = [...requiredField, ...emailField]
const requiredNameLengthField = [...requiredField, ...nameField, ...maxLengthField]
const requiredPercentageField = [...requiredField, ...integerOnlyField, ...maxLengthField, ...betweenField]
const optionalPercentageField = [...integerOnlyField, ...maxLengthField, ...betweenField]
const requiredDateField = [...requiredField, ...dateField, ...maxLengthField]
const optionalDateField = [...dateField, ...maxLengthField]
const requiredNumericMaxLengthField = [...requiredField, ...numericField, ...maxLengthField]
const optionalNumericMaxLengthField = [...numericField, ...maxLengthField]

const nameFieldErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, requiredNameLengthField)
}

const emailFieldErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, requiredEmailField)
}

const urlFieldErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, optionalURLLengthField)
}

const textFieldErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, requiredMaxLengthField)
}

const textFieldOptionalErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, maxLengthField)
}

const numericFieldErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, requiredNumericMaxLengthField)
}

const numericFieldOptionalErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, optionalNumericMaxLengthField)
}

const percentageFieldErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, requiredPercentageField)
}

const percentageFieldOptionalErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, optionalPercentageField)
}

const dateFieldErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, requiredDateField)
}

const dateFieldOptionalErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, optionalDateField)
}

const dropDownFieldErrors = function (field, errorMessages) {
  if (!field.$dirty) return []
  return validateField(field, errorMessages, requiredField)
}

const validateField = function (field, errorMessages, defaultErrors) {
  errorMessages = errorMessages || []
  const errorToCheck = (errorMessages.length > 0) ? errorMessages : defaultErrors
  return errorToCheck.reduce(function (accumulator, currentValue) {
    if (!field[currentValue.validator]) {
      accumulator.push(currentValue.msg)
    }
    return accumulator
  }, []
  )
}

export const validationMixin = {
  methods: {
    nameFieldErrors,
    emailFieldErrors,
    urlFieldErrors,
    textFieldErrors,
    textFieldOptionalErrors,
    percentageFieldErrors,
    percentageFieldOptionalErrors,
    dateFieldErrors,
    dateFieldOptionalErrors,
    dropDownFieldErrors,
    numericFieldErrors,
    numericFieldOptionalErrors
  }
}

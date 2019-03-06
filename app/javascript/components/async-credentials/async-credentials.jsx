import React, { Fragment, useState, createContext } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import {
  Button,
  FormGroup,
  Col,
  HelpBlock,
} from 'patternfly-react';
import ButtonSpinner from '../../forms/button-spinner';
import CheckErrors from './check-errors';
import { checkValidState } from './helper';

export const SecretContext = createContext();


const AsyncCredentials = ({
  FieldProvider,
  formOptions,
  validateLabel,
  validationProgressLabel,
  validateDefaultError,
  fields,
  name,
  asyncValidate,
}) => {
  const [asyncError, setAsyncError] = useState(validateDefaultError);
  const [validating, setValidating] = useState(false);
  const [lastValid, setLastValid] = useState({});
  const [initialValues] = useState(fields.reduce((acc, { name }) => ({
    ...acc,
    [name]: formOptions.getState().values[name],
  }), {}));
  const asyncFields = fields.map(({ name }) => name);

  const handleAsyncValidation = (formOptions, hiddenName, fieldNames) => {
    setValidating(true);
    const { values } = formOptions.getState();
    asyncValidate(values, fieldNames)
      .then(() => {
        formOptions.change(hiddenName, true);
        setLastValid(asyncFields.reduce((acc, curr) => ({ ...acc, [curr]: values[curr] }), {}));
        if (checkValidState(formOptions, name)) {
          formOptions.change(name, formOptions.getFieldState(name).initial);
        }
        setValidating(false);
      })
      .catch((error) => {
        formOptions.change(hiddenName, false);
        setAsyncError(error);
        setValidating(false);
      });
  };

  const enahncedChange = (value, name, validateName, change) => {
    let fieldValue = value;
    // check if value is event and replace the value if it is
    if (typeof fieldValue === 'object' && fieldValue.target && fieldValue.target.hasOwnProperty('value')) {
      fieldValue = fieldValue.target.value;
    }
    change(name, fieldValue);
    const { values } = formOptions.getState();
    const currentValues = asyncFields.reduce((acc, curr) => ({ ...acc, [curr]: values[curr] }), {});
    const valid = (isEqual(lastValid, currentValues) || isEqual(initialValues, currentValues)) ? undefined : false;
    setAsyncError(validateDefaultError);
    change(validateName, valid);
  };

  return (
    <SecretContext.Provider value={name}>
      {formOptions.renderForm(fields.map(field => ({
        ...field,
        isDisabled: field.isDisabled || validating,
        onChange: value => enahncedChange(value, field.name, name, formOptions.change),
      })), formOptions)}
      <FieldProvider name={name} validate={value => (value === false ? asyncError : undefined)}>
        {({ input, meta }) => (
          <FormGroup validationState={meta.error ? 'error' : null}>
            <Col md={2} componentClass="label" className="control-label" />
            <Col md={8}>
              <input type="hidden" {...input} />
              <CheckErrors subscription={{ valid: true, invalid: true, active: true }} names={asyncFields} FieldProvider={FieldProvider}>
                {(valid) => {
                  const disabled = valid.includes(false);
                  return (
                    <Fragment>
                      <Button
                        bsSize="small"
                        bsStyle="primary"
                        onClick={() => handleAsyncValidation(formOptions, name, asyncFields)}
                        disabled={disabled || validating}
                      >
                        {validating ? validationProgressLabel : validateLabel}
                        {validating && <ButtonSpinner /> }
                      </Button>
                      {meta.error && <HelpBlock>{asyncError}</HelpBlock>}
                    </Fragment>
                  );
                }}
              </CheckErrors>
            </Col>
          </FormGroup>
        )}
      </FieldProvider>
    </SecretContext.Provider>
  );
};

AsyncCredentials.propTypes = {
  FieldProvider: PropTypes.oneOfType([PropTypes.element.isRequired, PropTypes.func]).isRequired,
  formOptions: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    renderForm: PropTypes.func.isRequired,
  }).isRequired,
  validateLabel: PropTypes.string,
  validationProgressLabel: PropTypes.string,
  validateDefaultError: PropTypes.string,
  edit: PropTypes.bool,
  asyncValidate: PropTypes.func.isRequired,
};

AsyncCredentials.defaultProps = {
  validateLabel: __('Validate'),
  validationProgressLabel: __('Validating'),
  validateDefaultError: __('Validation Required'),
  edit: false,
};

export default AsyncCredentials;

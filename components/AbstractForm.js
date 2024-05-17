import React from "react";
import _ from "lodash";
import GridField from "components/form/GridField";


export default class AbstractForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dirty: false,
      valid: false,
      defaultValues: {}
    }
  }

  UNSAFE_componentWillMount() {
    this.setDefaultValues()
  }

  componentDidMount() {
    this.validate()
  }

  setDefaultValues() {
    let defaultValues = {}
    this.state.fields.forEach(f => {
      defaultValues[f.name] = f.value
    })

    this.setState({ defaultValues })
  }

  clearFields() {
    let defaultValues = this.state.defaultValues
    this.state.fields.forEach(f => {
      this.setField(f.name, defaultValues[f.name])
    })
  }

  getFormPayload() {
    let fields = this.getFields()
    let structure = {}

    fields.forEach(f => {
      if (f.name.indexOf('.') == -1) {
        structure[f.name] = this.getFieldValue(f)
      } else {
        let splitName = f.name.split('.')
        let firstKey = splitName[0]

        let obj = {}

        if (!_.isUndefined(structure[firstKey])) {
          obj[firstKey] = structure[firstKey]
        } else {
          obj[firstKey] = {}
        }

        let ref = obj[firstKey]

        for (var i = 1; i < splitName.length; i++) {
          let keyName = splitName[i]

          if (i == (splitName.length - 1)) {
            ref[keyName] = this.getField(f.name)
          } else {
            ref[keyName] = {}
          }

          ref = ref[keyName]
        }

        ref = this.getFieldValue(f)
        structure = _.extend(structure, obj)
      }
    })

    return structure
  }

  getFields() {
    return this.state.fields
  }

  setField(name, value) {
    let fields = this.getFields()

    for (var i = 0; i < fields.length; i++) {
      if (fields[i]['name'] === name) {
        fields[i]['value'] = value
      }
    }

    this.setState({ fields })
  }

  setFields(fieldsObj) {
    _.map(fieldsObj, (v, k) => {
      this.setField(k, v)
    })
  }

  setFieldValues(name, values) {
    let fields = this.getFields()

    for (var i = 0; i < fields.length; i++) {
      if (fields[i]['name'] === name) {
        fields[i]['values'] = values
      }
    }

    this.setState({ fields })
  }

  getFieldValue(field) {
    let val = this.getField(field.name)
    if (field.type == 'money') {
      return val.length == 0 ? null : val
    }

    return val
  }

  getField(name) {
    let fields = this.getFields()

    for (var i = 0; i < fields.length; i++) {
      if (fields[i]['name'] == name) {
        return fields[i]['value']
      }
    }

    return null
  }

    onChange = (key, value) => {
      this.setField(key, value)
      this.onChangeValidate()
    }

    onChangeValidate() {
      this.validate()
    }

    isValid() {
      return this.state.valid
    }

    validate() {
      let valid = true
      let fields = this.getFields()

      fields.forEach((f) => {
        if (f.required && f.value.length == 0) {
          valid = false
        }
      })

      // console.log('valid', valid)
      this.setState({ valid })
    }

    formRows() {
      let field
      let rows = []
      let state = this.state

      let fields = this.state.fields

      for (var i = 0; i < fields.length; i++) {
        field = fields[i]
        rows.push(<GridField ref={field.name} onChange={this.onChange} key={i} {...field} />)
      }

      return rows
    }

    setFieldFromArrayOfObjects(fieldName, items, valueKey, labelKey) {
      let values = []

      for (var j = 0; j < items.length; j++) {
        let item = items[j]
        values.push({
          value: item[valueKey],
          label: item[labelKey]
        })
      }

      this.setFieldValues(fieldName, values)
    }
}

const React = require('react');
const Component = require('react-pure-render/component');
const _ = require('lodash/core');

class Constraints extends Component {

  static propTypes = {
    constraints: React.PropTypes.object,
  };

  considerType(value) {
    if (_.isString(value)) {
      return `"${value}"`;
    }
    if (_.isNull(value)) {
      return 'null';
    }
    return value;
  }

  render() {
    const { constraints } = this.props;
    if (!constraints) return <div />;
    return (
      <ul className="constraints list-unstyled">
        {constraints.has('default') &&
          <li>Default value: <code>
          {this.considerType(constraints.get('default'))}
          </code></li>
        }

        {(constraints.get('minLength') || constraints.get('minLength') === 0) &&
          <li>Min length: {constraints.get('minLength')}</li>
        }

        {(constraints.get('maxLength') || constraints.get('maxLength') === 0) &&
          <li>Max length: {constraints.get('maxLength')}</li>
        }

        {(constraints.get('minimum') || constraints.get('minimum') === 0) &&
          <li>Min value: <code>{constraints.get('minimum')}</code></li>
        }

        {(constraints.get('maximum') || constraints.get('maximum') === 0) &&
          <li>Max value: <code>{constraints.get('maximum')}</code></li>
        }

        {constraints.get('enum') ?
          <li>Valid values: <ul>{constraints.get('enum').valueSeq().map(value =>
            <li key={value}><code>{this.considerType(value)}</code></li>
          )}</ul></li>
        :
        constraints.get('type') === 'boolean' &&
          <li>Valid values: <code>true</code>, <code>false</code></li>
        }

        {constraints.get('readOnly') && <li>Read only</li>}
        {constraints.get('pattern') && <li>Pattern: {constraints.get('pattern')}</li>}
        {constraints.get('notes') && <li>Notes: {constraints.get('notes')}</li>}
      </ul>
    );
  }

}

module.exports = Constraints;

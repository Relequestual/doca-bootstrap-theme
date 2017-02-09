const React = require('react');
const ImmutablePropTypes = require('react-immutable-proptypes');
const Component = require('react-pure-render/component');
const Sidebar = require('./sidebar');
const Schema = require('./schema');

class App extends Component {

  static propTypes = {
    schemas: ImmutablePropTypes.list.isRequired,
    config: React.PropTypes.object,
  };

  render() {
    const { schemas, config } = this.props;

    return (
      <div className="container-fluid" id="wrapper">
        <div className="row">
          <div className="col-sm-3 col-lg-2">
            <Sidebar schemas={schemas} config={config} />
          </div>
          <div className="col-sm-9 col-lg-10" id="page-content-wrapper">
            <h1>{config.title}</h1>
            {schemas
              .filter(schema => !schema.get('hidden'))
              .valueSeq()
              .map(schema => <Schema key={schema.get('id')} schema={schema} />)
            }
          </div>
        </div>
      </div>
    );
  }

}

module.exports = App;

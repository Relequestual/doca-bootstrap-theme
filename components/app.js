const React = require('react');
const ImmutablePropTypes = require('react-immutable-proptypes');
const marked = require('marked');
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

    const renderer = new marked.Renderer();

    renderer.table = (header, body) =>
      `<table class="table">
        <thead>${header}</thead>
        <tbody>${body}</tbody>
      </table>`;

    renderer.heading = (text, level) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

      return `<h${level}>
        <a name="${escapedText}" class="anchor" href="#${escapedText}">
          <span class="header-link"></span>
        </a>
      ${text}</h${level}>`;
    };

    return (
      <div className="container-fluid" id="wrapper">
        <div className="row">
          <div className="col-sm-3 col-lg-2">
            <Sidebar schemas={schemas} config={config} />
          </div>
          <div className="col-sm-9 col-lg-10" id="page-content-wrapper">
            <h1>{config.title}</h1>
            {config.intro && <div
              dangerouslySetInnerHTML={{ __html: marked(config.intro, { renderer }) }}
            >
            </div>}
            <h1>Objects and Endpoints</h1>
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

const React = require('react');
const ObjectDefinitionTable = require('./objectDefinitionTable');
const MarkdownPreview = require('react-marked-markdown').MarkdownPreview;
const ImmutablePropTypes = require('react-immutable-proptypes');
const { List, OrderedMap } = require('immutable');
const Component = require('react-pure-render/component');

const orderProperties = (order, props) =>
  new OrderedMap(order.toArray().
    reduce((hash, prop) =>
      Object.assign(hash, {
        [prop]: props.get(prop),
      }), {}
    )
  );

class Endpoint extends Component {

  static propTypes = {
    link: ImmutablePropTypes.map.isRequired,
    ordered_properties: React.PropTypes.object,
  };

  render() {
    const { link, ordered_properties } = this.props;
    const anyProps = link.hasIn(['parameters', 'all_props']);

    return (
      <section key={link.get('html_id')} id={link.get('html_id')} className="list-group-item">
        <h3>
          <span className="label label-success">{link.get('method')}</span>{' '}
          {link.get('title')}
        </h3>
        {link.get('description') && <MarkdownPreview value={link.get('description')} />}
        <pre>
          {link.get('method')} {link.get('uri')}
        </pre>
        {anyProps && <ObjectDefinitionTable
          sections={new List([
            {
              title: 'Required',
              definitions:
              orderProperties(ordered_properties,
                link.hasIn(['parameters', 'required_props'])
                ?
                  link.getIn(['parameters', 'all_props']).filter((val, key) =>
                    link.getIn(['parameters', 'required_props']).indexOf(key) > -1
                  )
                :
                  []
              ),
            },
            {
              title: 'Optional',
              definitions:
              orderProperties(ordered_properties,
                link.hasIn(['parameters', 'optional_props'])
                ?
                  link.getIn(['parameters', 'all_props']).filter((val, key) =>
                    link.getIn(['parameters', 'optional_props']).indexOf(key) > -1
                  )
                :
                  []
              ),
            },
          ])}
        />}

        <h4>cURL</h4>
        <div>
          <pre>{link.get('curl')}</pre>
        </div>

        <h4>Response</h4>
        <div>
          <pre>{link.get('response')}</pre>
        </div>
      </section>
    );
  }

}

module.exports = Endpoint;

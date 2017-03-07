const React = require('react');
const Constraints = require('./constraints');
const MarkdownPreview = require('react-marked-markdown').MarkdownPreview;
const { Map, List } = require('immutable');
const ImmutablePropTypes = require('react-immutable-proptypes');
const Component = require('react-pure-render/component');
const Definition = require('./definition');

class ObjectDefinitionTable extends Component {

  static propTypes = {
    sections: ImmutablePropTypes.list.isRequired,
  };

  TBody(props) {
    const definitions = props.definitions;
    const title = props.title;

    return (
      <tbody>
          {
            definitions.count() > 0 && title && <tr>
              <td colSpan="3" className="bg-info"><h4>{title}</h4></td>
            </tr>
          }
          {definitions && definitions.entrySeq().map(([key, definition]) =>
            <tr key={key}>

              <td>
                <strong>{key.toLowerCase()}</strong><br />
                <small><em>{List.isList(definition.get('type')) ?
                definition.get('type').valueSeq().join(', ') :
                definition.get('type')}</em></small>
              </td>
              <td>
                {definition.get('description') &&
                  <MarkdownPreview value={definition.get('description')} />}
                <div>
                  {definition.get('example') &&
                    <small>
                      <code>{definition.get('example')}</code>
                    </small>
                  }
                  {definition.get('oneOf') && <span><br />One of the following:</span>}
                  {definition.get('anyOf') && <span><br />Any of the following:</span>}
                </div>

                {definition.get('all_props') &&
                  <Definition definitions={definition.get('all_props')} />
                }

                {definition.get('oneOf') &&
                  definition.get('oneOf').entrySeq().map(([subkey, subdefinition]) =>
                    <div key={subkey}>
                      <h6>{subdefinition.get('description')}</h6>
                      <Definition definitions={subdefinition.get('all_props')} />
                    </div>
                )}

                {definition.get('anyOf') &&
                  definition.get('anyOf').entrySeq().map(([subkey, subdefinition]) =>
                    <div key={subkey}>
                      <h6>{subdefinition.get('description')}</h6>
                      <Definition definitions={subdefinition.get('all_props')} />
                    </div>
                )}
              </td>
              <td>
                <Constraints constraints={definition} />
              </td>
            </tr>
          )}
      </tbody>
    );
  }

  render() {
    const { sections } = this.props;

    return (
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th><p>Name <small>/type</small></p></th>
              <th><p>Description <small>/example</small></p></th>
              <th><p>Constraints</p></th>
            </tr>
          </thead>
          {sections.count() > 0 && sections.entrySeq().map(([key, section]) =>
            <this.TBody
              title={section.title}
              definitions={section.definitions.filter(x => Map.isMap(x))}
              key={key}
            />
          )}
        </table>
      </div>
    );
  }
}


module.exports = ObjectDefinitionTable;

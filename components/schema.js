const React = require('react');
const Endpoint = require('./endpoint');
const ObjectDefinitionTable = require('./objectDefinitionTable');
const MarkdownPreview = require('react-marked-markdown').MarkdownPreview;
const ImmutablePropTypes = require('react-immutable-proptypes');
const { List, OrderedMap } = require('immutable');
const Component = require('react-pure-render/component');
const ExampleObject = require('./exampleObject');

const orderProperties = (order, props) =>
  new OrderedMap(order.toArray().
    reduce((hash, prop) =>
      Object.assign(hash, {
        [prop]: props.get(prop),
      }), {}
    )
  );

class Schema extends Component {

  static propTypes = {
    schema: ImmutablePropTypes.map.isRequired,
  };

  state = {
    showDefinition: false,
  };

  handleToggle = () => {
    this.setState(prevState => ({
      showDefinition: !prevState.showDefinition,
    }));
  };


  render() {
    const { schema } = this.props;
    const { showDefinition } = this.state;
    return (
      <article className="panel panel-primary">
        <div className="panel-heading">
          <div id={schema.get('html_id')} />
          <h2>{schema.get('title')}</h2>
        </div>
        <div className="panel-body">
          <h3>{schema.get('description')}</h3>
          {schema.get('extended_description') &&
            <MarkdownPreview value={schema.get('extended_description')} />}

          <header id={`${schema.get('html_id')}-properties`}>
            {IS_JAVASCRIPT &&
              <p>
                <a onClick={this.handleToggle} className="btn btn-info">
                  <span>{showDefinition ? 'Hide' : 'Show'}</span>{' '}
                  object definition
                </a>
              </p>
            }
          </header>

          {(showDefinition || !IS_JAVASCRIPT) &&
            <div>
              {schema.getIn(['object_definition', 'objects']).count() ?
                <div>
                  {schema.getIn(['object_definition', 'objects']).valueSeq().map(obj =>
                    <div key={obj.get('title')}>
                      {obj.get('title') &&
                        <div>
                          <h4>{obj.get('title')}</h4>
                        </div>
                      }
                      {obj.get('example') && <ExampleObject example={obj.get('example')} />}
                      <ObjectDefinitionTable
                        sections={new List([
                          { definitions: orderProperties(
                            schema.get('properties_order'),
                            obj.get('all_props'),
                          ) },
                        ])}
                      />
                    </div>
                  )}
                </div>
              :
                <div>
                  {schema.getIn(['object_definition', 'example']) &&
                    <ExampleObject example={schema.getIn(['object_definition', 'example'])} />
                  }
                  <ObjectDefinitionTable
                    sections={new List([
                      { definitions: orderProperties(
                        schema.get('properties_order'),
                        schema.getIn(['object_definition', 'all_props']),
                      ) },
                    ])}
                  />
                </div>
              }
            </div>
          }
        </div>
        <div className="list-group">
          {schema
            .get('links')
            .filter(link => !link.get('private'))
            .valueSeq()
            .map(link =>
              <Endpoint
                key={link.get('html_id')}
                link={link}
                ordered_properties={schema.get('properties_order')}
              />
            )
          }
        </div>
      </article>
    );
  }

}

module.exports = Schema;

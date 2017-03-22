const React = require('react');
const Component = require('react-pure-render/component');
const ImmutablePropTypes = require('react-immutable-proptypes');
const { List } = require('immutable');
const Nav = require('react-bootstrap/lib/Nav');
const marked = require('marked');

const Navbar = require('react-bootstrap/lib/Navbar');
const NavDropdown = require('react-bootstrap/lib/NavDropdown');
const MenuItem = require('react-bootstrap/lib/MenuItem');

class Sidebar extends Component {

  static propTypes = {
    schemas: ImmutablePropTypes.list.isRequired,
    config: React.PropTypes.object,
  };

  renderNavTitle = (text) => {
    const titles = new List(marked.lexer(text))
      .filter(element => element.type === 'heading')
      .map(title => {
        const newTitle = title;
        newTitle.slug = title.text.toLowerCase().replace(/[^\w]+/g, '-');
        return newTitle;
      });

    return titles.filter(title => title.depth === 1).map((title) =>
      <NavDropdown title={title.text} id="nav-dropdown" key={`${title.slug}`}>
          {
            (titles
            .skipWhile(testTitle => testTitle !== title)
            .skipUntil(testTitle => testTitle !== title)
            .takeUntil(subTitle => subTitle.depth === 1))
            .map((subTitle) =>
              <MenuItem
                href={`#${subTitle.slug}`}
                key={`${title.slug}-${subTitle.slug}`}
              >{subTitle.text}</MenuItem>
            )
          }
      </NavDropdown>
    );
  };


  render() {
    const { schemas, config } = this.props;

    return (
      <Navbar collapseOnSelect className="navbar navbar-default navbar-fixed-side">
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">{config.title}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {config.intro && this.renderNavTitle(config.intro)}
            {schemas.filter(schema => !schema.get('hidden')).valueSeq().map(schema =>
              <NavDropdown
                title={schema.get('title')}
                id="nav-dropdown"
                key={schema.get('title')}
              >
                <MenuItem href={`#${schema.get('html_id')}`}>Object Definition</MenuItem>
                {schema.get('links').valueSeq().map(link =>
                  <MenuItem href={`#${link.get('html_id')}`} key={`${schema.get('title')}-${link.get('title')}`} >{link.get('title')}</MenuItem>
                )}
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

module.exports = Sidebar;

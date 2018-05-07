import React from 'react';
import {
  Card,
  CardActions,
  CardHeader,
  CardText,
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Field } from 'redux-form';
import moment from 'moment';

const SimpleRender = ({ input, meta, inputType }) => (
  <div>
    {inputType !== 'date' ? input.value : moment(input.value).format('DD/MM/YYYY')}
  </div>
)
export default class CardExampleControlled extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleExpand = () => {
    this.setState({expanded: true});
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };

  renderText = (name, inputType) => (
    <Field
      name={name}
      component={SimpleRender}
      inputType={inputType}
    />
  )
  render() {
    const {
      title = 'Todo 1',
      description = 'Dummy Description',
      dueDate = '01/01/2017',
      handleEdit,
      handleDelete,
      index,
    } = this.props;
    
    return (
      <Card className="each-todo-card" expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title={this.renderText(`todoList[${index}].title`, 'text')}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardHeader
          title={this.renderText(`todoList[${index}].dueDate`, 'date')}
        />
        <CardText expandable={true}>
          {description}
        </CardText>
        <CardActions>
          <FlatButton label="Edit" onClick={handleEdit(index)} />
          <FlatButton label="Delete" onClick={handleDelete(index)}  />
        </CardActions>
      </Card>
    );
  }
}
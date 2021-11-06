import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import MenuItem from '@material-ui/core/MenuItem';
import Slider from "@material-ui/core/Slider";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { Box } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 200
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const RightCard = (props) => {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const [proximity, setProximity] = useState(15)

  const [filterData, setFilterData] = useState({
    category: "none",
    priority: "none",
    status: "none"
  });
  const selectCategoryHandler = (e) => {
    setFilterData((prev) => {
      return {
        ...prev,
        category: e.target.value
      };
    });
  };
  const selectPriorityHandler = (e) => {
    setFilterData((prev) => {
      return {
        ...prev,
        priority: e.target.value
      };
    });
  };
  const selectStatusHandler = (e) => {
    setFilterData((prev) => {
      return {
        ...prev,
        status: e.target.value
      };
    });
  };

  const handleProximityChange = (e,newValue) => {
    setProximity(newValue)
  }

  const fileSubmitHandler = (e) => {
    e.preventDefault();

    props.updateFilterParams({
      proximity: proximity,
      category: filterData.category,
      priority: filterData.priority,
      status: filterData.status
    });

    props.updateFilter();
    props.loaderHome();
  };


  return (
    <div>
    <Card className={classes.root} data-aos="fade-up" style={{borderRadius:"15px"}}data-aos-delay="700">
      <CardContent>
        <Typography color="textDark" align="center" gutterBottom variant="h4">
          Filters
        </Typography>
        <br/>
        <br/>
        <Typography htmlFor="proximity" variant = "h5" component="h2" align="center">
          Based on Proximity
        </Typography>
        
        <Slider
          defaultValue={15}
          value = {proximity}
          aria-labelledby="discrete-slider-small-steps"
          step={5}
          onChange = {handleProximityChange}
          marks 
          min={15}
          max={50}
          valueLabelDisplay="auto"
        />
        <br />
       <hr />
       <br /> 
        <Typography htmlFor="category" variant = "h5" component="h2" align="center">
          Based on Category
        </Typography>
        <br/>
        <FormControl variant="filled" className={classes.formControl} style={{minWidth: 150,display:"flex",justifyContent:"center"}}>
          <InputLabel htmlFor="filled-age-native-simple">Category</InputLabel>
          <Select
            onChange={(e) => selectCategoryHandler(e)}
            inputProps={{
              name: "age",
              id: "filled-age-native-simple"
            }}
            align="center"
          >
          <MenuItem value="none" name="category">None</MenuItem>
          <MenuItem value="land issue" name="category">Land Issue</MenuItem>
          <MenuItem value="water issue" name="category">Water Issue</MenuItem>
          <MenuItem value="public health" name="category">Public Health</MenuItem>
          <MenuItem value="sanitation"  name="category"> Sanitation</MenuItem>
          <MenuItem value="pollution" name="category">Pollution</MenuItem>
          <MenuItem value="healthcare issue" name="category">Healthcare Issue</MenuItem>
          <MenuItem value="electricity" name="category">Electricity</MenuItem>
          <MenuItem value="road blockage" name="category">Road Blockage</MenuItem>
          <MenuItem value="waste management" name="category">Waste Management</MenuItem>
          </Select>
          
        </FormControl>
        <br/>
        <hr></hr>
        <br />
        <Typography htmlFor="priority" variant = "h5" component="h2" align="center">
          Based on Priority
        </Typography>
        <br/>
        <FormControl variant="filled" className={classes.formControl} style={{minWidth: 150,display:"flex",justifyContent:"center"}}>
          <InputLabel htmlFor="filled-age-native-simple">Priority</InputLabel>
          <Select
            onChange={(e) => selectPriorityHandler(e)}
            inputProps={{
              name: "age",
              id: "filled-age-native-simple"
            }}
            align="center"
          >
            <MenuItem value="none" name="category">None</MenuItem>
            <MenuItem value="emergency" name="category">Emergency</MenuItem>
            <MenuItem value="urgent" name="category">Urgent</MenuItem>
            <MenuItem value="not urgent" name="category">Not Urgent</MenuItem>
          </Select>
          <br />
        </FormControl>
        <br />
        <hr></hr>
        <br />
        <Typography htmlFor="status" variant = "h5" component="h2" align="center">
          Based on Status
        </Typography>
        <br />
        <FormControl variant="filled" className={classes.formControl} style={{minWidth: 150,display:"flex",justifyContent:"center"}}>
          <InputLabel htmlFor="filled-age-native-simple">Status</InputLabel>
          <Select
            onChange={(e) => selectStatusHandler(e)}
            inputProps={{
              name: "age",
              id: "filled-age-native-simple"
            }}
            align="center"
          >
            <MenuItem value="none" name="category">None</MenuItem>
            <MenuItem value="Solved" name="category">Ticket Solved</MenuItem>
            <MenuItem value="pending" name="category">Ticket Pending</MenuItem>
          </Select>
          <br />
        </FormControl>
      </CardContent>
      <CardActions align = "center">
        <Box alignItems = "center">
          <Button
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            onClick={fileSubmitHandler}
          >
            Apply Filters
          </Button>
        </Box>
      </CardActions>
    </Card>
    </div>
  );
}

export default RightCard
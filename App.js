import * as React from "react";
import {
  Text,
  View,
  Button,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import styles from "./Styles";

class RestaurantList extends React.Component {
  state = {
    loading: true,
    error: false,
    restaurants: [],
  };

  componentDidMount() {
    fetch("http://users.utu.fi/jaanle/restaurants")
      .then((res) => res.json())
      .then((restaurants) =>
        this.setState({ loading: false, restaurants: restaurants })
      )
      .catch((e) => this.setState({ error: true, loading: false }));
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator animating={true} />
        </View>
      );
    }

    if (this.state.error) {
      return (
        <View>
          <Text>Failed to load restaurants!</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.restaurantview}>
        {this.state.restaurants.map((restaurant) => (
          <Restaurant
            key={restaurant.id}
            name={restaurant.name}
            id={restaurant.id}
            navigation={this.props.navigation}
          />
        ))}
        <Button
          title="Admin"
          onPress={() => this.props.navigation.navigate("Admin")}
        />
      </ScrollView>
    );
  }
}

const Restaurant = (props) => {
  return (
    <Button
      title={props.name}
      onPress={() =>
        props.navigation.navigate("Menus", { id: props.id, name: props.name })
      }
    />
  );
};

class MenuScreen extends React.Component {
  state = {
    menu: [],
    loading: true,
    error: false,
  };
  componentDidMount() {
    fetch(
      `http://users.utu.fi/jaanle/restaurants/${this.props.route.params.id}`
    )
      .then((res) => res.json())
      .then((menu) => this.setState({ menu: menu, loading: false }))
      .catch((e) => this.setState({ error: true, loading: false }));
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator animating={true} />
        </View>
      );
    }
    if (this.state.error) {
      return (
        <View>
          <Text>Failed to load menu!</Text>
        </View>
      );
    }
    return (
      <ScrollView>
        {this.state.menu.map((weekday) => (
          <Weekday key={weekday.id} weekday={weekday} />
        ))}
      </ScrollView>
    );
  }
}

const Weekday = (props) => {
  return (
    <View>
      <Text style={styles.dayview}>{props.weekday.name}</Text>
      {props.weekday.menuitems.map((meal) => (
        <Meal key={meal.id} meal={meal} />
      ))}
    </View>
  );
};

const Meal = (props) => {
  return <Text style={styles.dayitemview}>{props.meal.name}</Text>;
};

const AdminScreen = (props) => {
  return (
    <View style={styles.adminview}>
      <TextInput placeholder="Write the name of the menuitem" />
      <Button
        title="Send"
        onPress={() => alert("No saving action implemented in this example")}
      />
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Restaurants">
        <Stack.Screen
          name="Restaurants"
          component={RestaurantList}
          options={{ title: "Welcome to Menus" }}
        />
        <Stack.Screen
          name="Menus"
          component={MenuScreen}
          options={({ route }) => ({ title: route.params.name })}
        />
        <Stack.Screen name="Admin" component={AdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

import CalendarScreen from "@screens/Calendar";
import { withAuthGuard } from "../components/HOCS/withAuthGuard";

const IndexPage = () => {
  return <CalendarScreen />;
};

export default withAuthGuard(IndexPage);

import CalendarScreen from "@screens/Calendar";
import { withAuthGuard } from "@shared/HOCS/withAuthGuard";

const IndexPage = () => {
  return <CalendarScreen />;
};

export default withAuthGuard(IndexPage);

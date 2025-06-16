import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CardComponent = ({ title, value }) => {
  return (
    <Card className="bg-[#C70039] shadow-md border border-gray-300 rounded-lg hover:bg-black transition duration-300 flex flex-col justify-between p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-white text-sm font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex items-center">
        <p className="text-3xl font-bold text-white">{value}</p>
      </CardContent>
    </Card>
  );
};

export default CardComponent;

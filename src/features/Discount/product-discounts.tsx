import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NoItems from "@/features/NoItems";
import useSales from "@/hooks/useSales";
import { useNavigate } from "react-router-dom";
import ProductDiscountTable from "./product-discount-table";

const ProductDiscounts = () => {
  const navigate = useNavigate()

  const { getAllSalesQuery } = useSales();

  const { data, isLoading, isError } = getAllSalesQuery({ is_free: true });

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <>
      {data?.data.length ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Chegirma mahsulotlar</CardTitle>
              <CardDescription>
                Chegirma mahsulotlarini bu yerdan boshqaring.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ProductDiscountTable data={data} />
          </CardContent>
        </Card>
      ) : (
        <NoItems setOpen={() => navigate("/sales")} />
      )}
    </>
  );
};

export default ProductDiscounts;

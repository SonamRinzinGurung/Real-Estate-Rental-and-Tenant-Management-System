import { useEffect } from "react";
import { getAllContacts } from "../../features/ownerUser/ownerUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, Footer, ContactsCard } from "../../components";

const AllContacts = () => {
  const dispatch = useDispatch();
  const { contacts, isLoading } = useSelector((state) => state.ownerUser);
  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  if (isLoading) return <PageLoading />;

  if (contacts?.length === 0) {
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>You do not have any contacts</h1>
      </div>
    );
  }

  return (
    <>
      <main className="flex flex-col mb-12 mt-8 md:items-start md:ml-10">
        <h3 className="my-4 font-heading font-bold text-center">Contacts</h3>
        <div className="justify-center flex flex-wrap gap-8 mx-4 md:mx-0">
          {contacts?.map((user) => {
            return <ContactsCard key={user._id} {...user} />;
          })}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AllContacts;

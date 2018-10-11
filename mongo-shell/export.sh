until mongo --host ${MongoDB} --eval "print(\"waited for connection\")"
do
    sleep 3
done

echo "Migrating data to MongoDB..."

mongo ${MongoDB} mongo-export.js

echo "MongoDB data migrated."

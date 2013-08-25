cd $1
for f in `ls *.JPG`
do
  echo $f
  convert -rotate 180.5 -crop 1824x1104+1528+996 ../$1/$f ../$2/$f
done

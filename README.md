TripFlow

Server:

brew install rbenv ruby-build

Add rbenv to bash so that it loads every time you open a terminal:

echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.bash_profile

source ~/.bash_profile

Install Ruby:

rbenv install 2.2.3

rbenv global 2.2.3

ruby -v

gem install sinatra

gem install httparty

run: ruby server.rb

Current endpoints:

http://localhost:4567/search/:dest 
example: http://localhost:4567/search/rome


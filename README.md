TripFlow

Server:\n
brew install rbenv ruby-build\n

Add rbenv to bash so that it loads every time you open a terminal:\n
echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.bash_profile\n
source ~/.bash_profile\n

Install Ruby:\n
rbenv install 2.2.3\n
rbenv global 2.2.3\n
ruby -v\n

gem install sinatra\n
gem install httparty\n

run: ruby server.rb\n
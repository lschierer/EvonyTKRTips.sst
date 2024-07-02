#!perl
use 5.40.0;
use strict;
use warnings;
use Test::More;

plan tests => 3;

BEGIN {
    use_ok( 'Game::Evony::General' ) || print "Bail out!\n";
    use_ok( 'Game::Evony::Speciality' ) || print "Bail out!\n";
    use_ok( 'Game::Evony::Specialist' ) || print "Bail out!\n";
}

diag( "Testing Game::Evony::General $Game::Evony::General::VERSION, Perl $], $^X" );

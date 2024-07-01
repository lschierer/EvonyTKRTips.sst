#!perl
use 5.006;
use strict;
use warnings;
use Test::More;

plan tests => 6;

BEGIN {
    use_ok( 'General' ) || print "Bail out!\n";
    use_ok( 'Speciality' ) || print "Bail out!\n";
    use_ok( 'SkillBook' ) || print "Bail out!\n";
    use_ok( 'GeneralConflictData' ) || print "Bail out!\n";
    use_ok( 'Convenant' ) || print "Bail out!\n";
    use_ok( 'GeneralPair' ) || print "Bail out!\n";
}

diag( "Testing General $General::VERSION, Perl $], $^X" );
